const getUsersByNameQuery = "SELECT * FROM users WHERE username = $1";
const getRolesByUserId =
  "SELECT b.name FROM user_roles a JOIN roles b on a.role_id = b.id WHERE a.user_id = $1";

module.exports = {
  getUsersByNameQuery,
  getRolesByUserId,
};
