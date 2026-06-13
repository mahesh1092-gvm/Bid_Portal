import axios from "axios";

async function run() {
  try {
    const form = new FormData();
    form.append("name", "Test Multipart");
    form.append("email", `test-multipart-${Date.now()}@example.com`);
    form.append("password", "password123");
    form.append("role", "CLIENT");
    form.append("bio", "Bio info");
    form.append("githubUrl", "https://github.com");
    form.append("linkedinUrl", "https://linkedin.com");
    form.append("portfolioUrl", "https://portfolio.com");
    form.append("skills", "React, Node");
    form.append("education", "University");

    const res = await axios.post("http://localhost:5000/api/auth/register", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error status:", err.response?.status);
    console.error("Error data:", err.response?.data);
  }
}

run();
