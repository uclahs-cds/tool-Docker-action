module.exports = ({ github, context }) => {
  console.log('Triggered by a deletion!')
  console.log(github)
  console.log(context)
}
