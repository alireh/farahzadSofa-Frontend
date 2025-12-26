// hooks/useConfirm.ts
import { useState, useCallback } from 'react';

export interface ConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export interface ConfirmDialogState extends ConfirmOptions {
    isOpen: boolean;
}

export interface UseConfirmReturn {
    confirmState: ConfirmDialogState;
    showConfirm: (options: ConfirmOptions) => Promise<boolean>;
    hideConfirm: () => void;
    onConfirm: () => void;
    onCancel: () => void;
}

export const useConfirm = (): UseConfirmReturn => {
    const [confirmState, setConfirmState] = useState<ConfirmDialogState>({
        isOpen: false,
        title: 'تأیید عملیات',
        message: '',
        confirmText: 'تأیید',
        cancelText: 'انصراف',
        type: 'warning'
    });

    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                title: options.title || 'تأیید عملیات',
                message: options.message,
                confirmText: options.confirmText || 'تأیید',
                cancelText: options.cancelText || 'انصراف',
                type: options.type || 'warning'
            });
            setResolvePromise(() => resolve);
        });
    }, []);

    const hideConfirm = useCallback(() => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        if (resolvePromise) {
            resolvePromise(false);
            setResolvePromise(null);
        }
    }, [resolvePromise]);

    const onConfirm = useCallback(() => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        if (resolvePromise) {
            resolvePromise(true);
            setResolvePromise(null);
        }
    }, [resolvePromise]);

    const onCancel = useCallback(() => {
        hideConfirm();
    }, [hideConfirm]);

    return {
        confirmState,
        showConfirm,
        hideConfirm,
        onConfirm,
        onCancel
    };
};