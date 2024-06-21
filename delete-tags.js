module.exports = ({ github, context }) => {
  console.log('Triggered by a deletion!')
  console.log(context)

  const { IMAGE_NAME } = process.env
  console.log(IMAGE_NAME)

  // await github.rest.packages.deletePackageVersionForAuthenticatedUser(
  //   package_type: 'container',
  //   package_name: IMAGE_NAME,
  //   package_version_id: ???
  // )
}
