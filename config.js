module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '8080',
    URL: process.env.BASE_URL || 'http://localhost:8080',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://isoumyad1:isoumyad1@cluster1.ycjqp1d.mongodb.net/backend-softify-learning?retryWrites=true&w=majority'
}