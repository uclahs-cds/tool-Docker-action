module.exports = async ({ github, context }) => {
  const { IMAGE_NAME } = process.env

  for await (const response of github.paginate.iterator(
    github.rest.packages.getAllPackageVersionsForAPackageOwnedByAnOrg, {
      package_type: 'container',
      package_name: IMAGE_NAME,
      org: context.payload.organization.login
    })) {
    console.log('This is a loop iteration')
    console.log(response)
  }
}
