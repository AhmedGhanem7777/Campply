
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const FloatingSupportButton = () => {
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-10 h-10"
  >
    <path
      fill="#25D366"
      d="M12 0C5.373 0 0 5.373 0 12c0 2.116.552 4.107 1.516 5.837L0 24l6.348-1.662A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"
    />
    <path
      fill="#fff"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.1-.47-.148-.667.149-.198.297-.766.967-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.76-1.653-2.057-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.371-.025-.52-.075-.149-.667-1.607-.915-2.203-.241-.579-.485-.5-.667-.509l-.57-.01c-.198 0-.52.074-.793.372-.272.297-1.04 1.016-1.04 2.477 0 1.461 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.082 4.487.71.308 1.263.492 1.695.63.712.227 1.36.195 1.871.118.57-.085 1.758-.718 2.003-1.413.247-.694.247-1.289.173-1.414-.074-.125-.272-.198-.57-.347z"
    />
  </svg>
);


  return (
    <motion.div
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        asChild
        size="lg"
        className="rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center w-14 h-14 p-0"
      >
        <a
          href="https://wa.me/96878066874"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-full"
        >
          <WhatsAppIcon />
        </a>
      </Button>
    </motion.div>
  );
};

export default FloatingSupportButton;
