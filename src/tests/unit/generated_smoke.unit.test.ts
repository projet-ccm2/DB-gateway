test("generated prisma browser & models smoke", () => {
  // require the generated browser and models files to mark their top-level exports as used
  const browser = require("../../generated/prisma/browser");
  const models = require("../../generated/prisma/models");
  expect(browser).toBeDefined();
  expect(models).toBeDefined();
});
