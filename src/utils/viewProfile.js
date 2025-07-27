function viewProfile(user) {
  try {
    const { _id, password, createdAt, updatedAt, __v, ...userProfile } = user;
    return userProfile;
  } catch (err) {
    console.log("This is the error message ", err.message);
  }
}

module.exports = { viewProfile };
