import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = (process.env.API_URL || "http://localhost:5500").replace(/\/$/, "");
const DATASET_PATH = path.join(__dirname, "data", "minimal.seed.json");

const context = {
  tokensByEmail: {},
  userIdsByEmail: {},
};

const pretty = (value) => JSON.stringify(value, null, 2);

const buildError = async (response, route, method) => {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const err = new Error(
    `Request failed ${method} ${route} -> ${response.status}${payload?.message ? `: ${payload.message}` : ""}`
  );

  err.status = response.status;
  err.payload = payload;
  err.route = route;
  err.method = method;

  return err;
};

const request = async ({ method, route, token, body }) => {
  const headers = {
    "content-type": "application/json",
  };

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${route}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await buildError(response, route, method);
  }

  const payload = await response.json();
  return payload;
};

const loadDataset = async () => {
  const raw = await fs.readFile(DATASET_PATH, "utf8");
  return JSON.parse(raw);
};

const signUpUsers = async (users) => {
  console.log("Phase 1/6: signing up users");

  for (const user of users) {
    let payload;

    try {
      payload = await request({
        method: "POST",
        route: "/api/v1/auth/signup",
        body: user,
      });
    } catch (error) {
      if (error.status !== 409) {
        throw error;
      }

      payload = await request({
        method: "POST",
        route: "/api/v1/auth/login",
        body: user,
      });
      console.log(`  user ${user.email} already exists; logged in instead`);
    }

    context.tokensByEmail[user.email] = payload.data.token;
    context.userIdsByEmail[user.email] = payload.data.user._id;

    console.log(`  ready user ${user.email} (${payload.data.user._id})`);
  }
};

const createTenant = async (tenantConfig, ownerEmail) => {
  console.log("Phase 2/6: creating tenant");

  const payload = await request({
    method: "POST",
    route: "/api/v1/tenants",
    token: context.tokensByEmail[ownerEmail],
    body: tenantConfig,
  });

  context.tenantId = payload.data._id;
  console.log(`  created tenant ${tenantConfig.name} (${context.tenantId})`);
};

const addTenantMember = async ({ email, role }, ownerEmail) => {
  console.log("Phase 3/6: adding tenant member");

  const payload = await request({
    method: "POST",
    route: `/api/v1/tenants/${context.tenantId}/members`,
    token: context.tokensByEmail[ownerEmail],
    body: {
      userId: context.userIdsByEmail[email],
      role,
    },
  });

  console.log(`  added member ${email} as ${role}; total members: ${payload.data.members.length}`);
};

const createGroup = async (groupConfig, ownerEmail) => {
  console.log("Phase 4/6: creating group and credential");

  const groupPayload = await request({
    method: "POST",
    route: `/api/v1/tenants/${context.tenantId}/groups`,
    token: context.tokensByEmail[ownerEmail],
    body: groupConfig,
  });

  context.groupId = groupPayload.data._id;
  console.log(`  created group ${groupConfig.name} (${context.groupId})`);
};

const createCredential = async (credentialConfig, ownerEmail) => {
  const secret =
    typeof credentialConfig.secret === "string"
      ? credentialConfig.secret
      : JSON.stringify(credentialConfig.secret);

  const credentialPayload = await request({
    method: "POST",
    route: `/api/v1/tenants/${context.tenantId}/credentials`,
    token: context.tokensByEmail[ownerEmail],
    body: {
      ...credentialConfig,
      secret,
    },
  });

  context.credentialId = credentialPayload.data._id;
  console.log(`  created credential ${credentialConfig.name} (${context.credentialId})`);
};

const createDevice = async (deviceConfig, ownerEmail) => {
  console.log("Phase 5/6: creating device");

  let serial = deviceConfig.serialNumber || Math.floor(Date.now() % 1000000);
  let attempts = 0;
  let lastError = null;

  while (attempts < 10) {
    try {
      const payload = await request({
        method: "POST",
        route: `/api/v1/tenants/${context.tenantId}/devices`,
        token: context.tokensByEmail[ownerEmail],
        body: {
          ...deviceConfig,
          serialNumber: serial,
          groupIds: [context.groupId],
        },
      });

      context.deviceId = payload.data._id;
      console.log(`  created device ${deviceConfig.name} (${context.deviceId}) with serial ${serial}`);
      return;
    } catch (err) {
      lastError = err;
      const message = (err.payload?.error || err.payload?.message || "").toString().toLowerCase();
      if (err.status === 400 && message.includes("duplicate")) {
        attempts += 1;
        serial += 1;
        console.log(`  serial conflict, retrying with serial ${serial} (attempt ${attempts})`);
        continue;
      }
      throw err;
    }
  }

  throw lastError;
};

const createEndpoint = async (endpointConfig, ownerEmail) => {
  console.log("Phase 6/6: creating endpoint");

  const payload = await request({
    method: "POST",
    route: `/api/v1/tenants/${context.tenantId}/endpoints`,
    token: context.tokensByEmail[ownerEmail],
    body: {
      ...endpointConfig,
      groupIds: [context.groupId],
      credentialId: context.credentialId,
    },
  });

  context.endpointId = payload.data._id;
  console.log(`  created endpoint ${endpointConfig.name} (${context.endpointId})`);
};

const printSummary = (dataset) => {
  console.log("\nSeed completed successfully.\n");
  console.log(pretty({
    apiUrl: API_URL,
    users: dataset.users.map((user) => ({
      email: user.email,
      userId: context.userIdsByEmail[user.email],
      token: context.tokensByEmail[user.email],
    })),
    tenantId: context.tenantId,
    groupId: context.groupId,
    credentialId: context.credentialId,
    deviceId: context.deviceId,
    endpointId: context.endpointId,
  }));
};

const printErrorAndExit = (error) => {
  console.error("\nSeed failed.\n");
  console.error(error.message);

  if (error.payload) {
    console.error("Server response:");
    console.error(pretty(error.payload));
  }

  if (error.status === 409) {
    console.error("\nHint: fixed seed emails/serialNumber may already exist. Remove those records and run again.");
  }

  process.exitCode = 1;
};

const main = async () => {
  const dataset = await loadDataset();
  const ownerEmail = dataset.users[0]?.email;

  if (!ownerEmail) {
    throw new Error("Dataset must contain at least one user to act as tenant owner");
  }

  await signUpUsers(dataset.users);
  await createTenant(dataset.tenant, ownerEmail);
  await addTenantMember(dataset.member, ownerEmail);
  await createGroup(dataset.group, ownerEmail);
  await createCredential(dataset.credential, ownerEmail);
  await createDevice(dataset.device, ownerEmail);
  await createEndpoint(dataset.endpoint, ownerEmail);

  printSummary(dataset);
};

main().catch(printErrorAndExit);
