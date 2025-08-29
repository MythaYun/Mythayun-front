'use client'

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, LogOut, X } from 'lucide-react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}: LogoutConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center border border-red-500/30">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          
          <DialogTitle className="text-xl font-bold text-white">
            Confirmer la déconnexion
          </DialogTitle>
          
          <DialogDescription className="text-slate-300 text-base leading-relaxed">
            Êtes-vous sûr de vouloir vous déconnecter ? Cette action supprimera toutes vos données locales et vous devrez vous reconnecter pour accéder à l'application.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
          >
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-lg hover:shadow-red-500/25 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Déconnexion...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
