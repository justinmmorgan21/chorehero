const apiConfig = {
  backendBaseUrl:
    import.meta.env.MODE === "production"
      ? `https://chorehero-api.onrender.com`
      : "http://localhost:3000",
};

export default apiConfig;
