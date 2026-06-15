export const systemController = {
  healthcheck: (req, res) => {
    return res.status(200).json({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      message: 'E-commerce API is healthy.'
    });
  }
};
