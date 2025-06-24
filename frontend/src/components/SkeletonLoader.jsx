"use client"
import { motion } from "framer-motion"

const SkeletonLoader = ({ type = "product" }) => {
  const shimmer = {
    hidden: { opacity: 0.3 },
    visible: { opacity: 1 },
  }

  if (type === "product") {
    return (
      <div className="animate-pulse bg-white rounded-3xl shadow-lg overflow-hidden">
        <motion.div
          className="relative aspect-square bg-gray-200"
          variants={shimmer}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <div className="p-4 sm:p-6">
          <motion.div
            className="h-6 bg-gray-200 rounded w-3/4 mb-4"
            variants={shimmer}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 0.2,
            }}
          />
          <motion.div
            className="h-4 bg-gray-200 rounded w-1/2 mb-4"
            variants={shimmer}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 0.4,
            }}
          />
          <motion.div
            className="h-4 bg-gray-200 rounded w-1/4"
            variants={shimmer}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 0.6,
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="h-4 bg-gray-200 rounded"
      variants={shimmer}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    />
  )
}

export default SkeletonLoader
