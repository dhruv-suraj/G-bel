import React from 'react';

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface UseCase {
  title: string;
  subtitle: string;
  status: 'ACTIVE' | 'PLANNED';
  items: string[];
  description: string;
}

export interface ComparisonPoint {
  challenge: string;
  solution: string;
}