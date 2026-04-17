export default function handler(req, res) {
  res.status(200).json({ 
    message: "API System is Online", 
    time: new Date().toISOString() 
  });
}
