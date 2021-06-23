const semver = require('semver')

async function spawn() {
  const { spawn } = require('child_process');
  const child = spawn('swift', ["--version"]);

  let data = "";
  for await (const chunk of child.stdout) {
      data += chunk;
  }
  for await (const chunk of child.stderr) {
      console.error(chunk);
  }
  const exitCode = await new Promise(resolve => child.on('close', resolve))

  if (exitCode) {
    throw new Error(`abort: ${exitCode}`);
  }

  return data;
}

async function run() {
  const stdout = await spawn()
  const matches = stdout.match(/Swift version (.+?)\s/m)
  const swift = semver.coerce(matches[1])
  if (!swift) throw new Error(`couldn’t determine Swift version [\`${stdout}\`]`)

  process.stdout.write(`::set-output name=version::${swift}\n`)

  const constraint = process.env['INPUT_REQUIRES'].trim()

  if (constraint && !semver.satisfies(swift, constraint)) {
    throw new Error(`Swift version mismatch [\`${swift}\`, \`${constraint}\`]`)
  }
}

run().catch(err => {
  process.exitCode = 1
  console.error(err)
})
