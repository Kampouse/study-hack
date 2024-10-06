
connect(async (client) => {
  // Run TypeScript tests
  const test = client
    .container()
    .from("node:16")
    .withDirectory("/app", client.host().directory("."))
    .withWorkdir("/app")
    .withExec(["npm", "install"])
    .withExec(["npm", "test"]);

  // Get test output
  const output = await test.stdout();

  console.log(output);
});
