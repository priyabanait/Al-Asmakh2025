'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useCompare } from '../contexts/CompareContext';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';

export default function CompareModal() {
  const { compareProperties, showCompareModal, setShowCompareModal, removeFromCompare, clearCompare } = useCompare();

  if (!showCompareModal || compareProperties.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowCompareModal(false)}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#001730] text-white">
            <h2 className="text-2xl font-bold">Compare Properties</h2>
            <div className="flex items-center gap-4">
              {compareProperties.length > 0 && (
                <button
                  onClick={clearCompare}
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {compareProperties.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">No properties to compare</p>
                <p className="text-gray-400 text-sm mt-2">Add properties to compare them side by side</p>
              </div>
            ) : (
              <div className="p-6">
                {/* Comparison Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {compareProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      {/* Remove Button */}
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(property.id)}
                          className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-colors"
                        >
                          <X size={16} className="text-gray-600" />
                        </button>

                        {/* Image */}
                        <div className="relative w-full h-64">
                          <Image
                            src={property.image || '/div.property-thumbnail-wrapper.png'}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-[#001730] mb-2 line-clamp-2">
                          {property.title}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center text-gray-600 text-sm mb-4">
                          <MapPin size={14} className="mr-2" />
                          <span>{property.location}</span>
                        </div>

                        {/* Comparison Details */}
                        <div className="space-y-3 mb-4">
                          {/* Price */}
                          <div className="flex justify-between items-center p-3 bg-white rounded-md">
                            <span className="text-sm text-gray-600">Price</span>
                            <span className="text-base font-bold text-[#001730]">{property.price} QAR</span>
                          </div>

                          {/* Bedrooms */}
                          <div className="flex justify-between items-center p-3 bg-white rounded-md">
                            <div className="flex items-center gap-2">
                              <Image
                                src="/Icon (1).png"
                                alt="Beds"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                              <span className="text-sm text-gray-600">Bedrooms</span>
                            </div>
                            <span className="text-sm font-semibold text-[#001730]">{property.bedrooms}</span>
                          </div>

                          {/* Bathrooms */}
                          <div className="flex justify-between items-center p-3 bg-white rounded-md">
                            <div className="flex items-center gap-2">
                              <Image
                                src="/Icon.png"
                                alt="Baths"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                              <span className="text-sm text-gray-600">Bathrooms</span>
                            </div>
                            <span className="text-sm font-semibold text-[#001730]">{property.bathrooms}</span>
                          </div>

                          {/* Area */}
                          <div className="flex justify-between items-center p-3 bg-white rounded-md">
                            <div className="flex items-center gap-2">
                              <Image
                                src="/Icon (2).png"
                                alt="Area"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                              <span className="text-sm text-gray-600">Area</span>
                            </div>
                            <span className="text-sm font-semibold text-[#001730]">{property.area}</span>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <Link
                          href={`/propertydetails?id=${property.id}`}
                          className="block w-full bg-[#001730] text-white text-sm font-medium px-4 py-2.5 rounded-md hover:bg-[#002d52] transition-colors flex items-center justify-center gap-2"
                        >
                          <span>View Details</span>
                          <FaArrowRight size={12} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Add placeholder if only 1 property */}
                {compareProperties.length === 1 && (
                  <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm mb-4">Add another property to compare</p>
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                      <p className="text-gray-400">Select another property to compare</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

