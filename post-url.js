module.exports = async ({ github, context, core }) => {
  const { IMAGE_NAME, IMAGE_ID } = process.env

  for await (const response of github.paginate.iterator(
    github.rest.packages.getAllPackageVersionsForPackageOwnedByOrg, {
      package_type: 'container',
      package_name: IMAGE_NAME,
      org: context.payload.organization.login
    })) {
    for (const version of response.data) {
      if (version.name === IMAGE_ID) {
        core.notice(`Uploaded new image ${version.html_url}`)
        return
      }
    }
  }

  core.error('Could not find URL for new image!')
}
