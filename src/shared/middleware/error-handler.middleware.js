export const errorHandler = (e, req, res, next) => {
  console.error(e);
  res.status(500).json({ error: "Internal Server Error" });
};
