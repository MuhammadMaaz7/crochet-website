const notFound = (req, res) => {
    res.status(404).json({
      message: `Route ${req.originalUrl} not found`,
      method: req.method,
    })
  }
  
  export default notFound
  