module.exports = async ({ github, context }) => {
  const { IMAGE_NAME } = process.env
  const tagName = `branch-${context.payload.ref}`

  let didDelete = false

  for await (const response of github.paginate.iterator(
    github.rest.packages.getAllPackageVersionsForPackageOwnedByOrg, {
      package_type: 'container',
      package_name: IMAGE_NAME,
      org: context.payload.organization.login
    })) {
    for (const version of response.data) {
      if (version.metadata?.container?.tags?.includes?.(tagName)) {
        console.log(`Package version ${version.html_url} matches tag ${tagName}`)
        // FIXME Insert actual deletion call here
        didDelete = true
        break
      }
    }
    if (didDelete) {
      break
    }
  }

  if (!didDelete) {
    console.log(`Failed to find tag named ${tagName}`)
  }
}
