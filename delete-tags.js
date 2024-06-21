module.exports = async ({ github, context }) => {
  const { IMAGE_NAME } = process.env

  for await (const response of github.paginate.iterator(
    github.rest.packages.getAllPackageVersionsForAPackageOwnedByAnOrg, {
      package_type: 'container',
      package_name: IMAGE_NAME,
      org: context.payload.organization.login
    })) {
    // let didDelete = false
    for (const version of response.data) {
      const tags = version.metadata?.tags
      console.log(version.name)
      console.log(tags)
      // didDelete = true
    }
    // if (didDelete) {
    //   break
    // }
  }
}
