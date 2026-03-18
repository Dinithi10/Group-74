import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  HomeIcon,
  BoxIcon,
  ArmchairIcon,
  PlusIcon } from
'lucide-react';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/ui/StatsCard';
import { ProjectCard } from '../components/ui/ProjectCard';
export function DashboardPage() {