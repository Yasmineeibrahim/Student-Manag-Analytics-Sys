export const fetchStudents = async (req, res) => {
  try {
    console.log("Fetching all students");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }}