import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SearchIcon,
  SortDescIcon,
  FolderOpenIcon,
  Trash2Icon,
  AlertTriangleIcon } from
'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/ui/ProjectCard';
export function AdminDesignsPage() {