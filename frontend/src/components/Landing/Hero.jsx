import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6bTAgMmMtMi4yMSAwLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00LTEuNzktNC00LTR6IiBmaWxsPSIjZmRiYWNjIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
                style={{ fontFamily: 'Pacifico, cursive' }}
              >
                Handmade with{' '}
                <span className="text-pink-500">Love</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-gray-600 max-w-md mx-auto lg:mx-0"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Discover our collection of beautiful, handcrafted crochet pieces that bring warmth and joy to your everyday life.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-pink-500 text-white rounded-full text-base sm:text-lg font-medium hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30"
              >
                Shop Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-white text-pink-500 rounded-full text-base sm:text-lg font-medium hover:bg-pink-50 transition-colors border-2 border-pink-500"
              >
                View Patterns
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mt-12 lg:mt-0"
          >
            <div className="relative z-10">
              <img
                src="/images/b.jpeg"
                alt="Handmade crochet items"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto lg:max-w-none"
              />
            </div>
            <div className="absolute top-0 -right-4 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 left-20 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -top-6 left-4 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}