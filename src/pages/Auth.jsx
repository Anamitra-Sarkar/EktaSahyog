import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Mail, Lock, User, MapPin, Globe, Loader2, Sparkles, ArrowRight, ScanLine } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import OCRModal from '../Components/features/OCRModal';
import BackgroundBeams from '../Components/ui/BackgroundBeams';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';