import { motion } from 'framer-motion';

export default function ChannelButton({ icon, onClick }) {
  return (
    <motion.div
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.97 }}
  onClick={onClick}
  className="wii-channel wii-hover-effect"  // ← ADD this class
>

      <img src={icon} alt="" className="wii-channel-icon" />
    </motion.div>
  );
}
