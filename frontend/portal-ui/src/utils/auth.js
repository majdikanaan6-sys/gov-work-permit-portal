export const logout = () => {
  localStorage.removeItem("workerData");
  window.location.href = "/workerverify";
};