/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScanLine, Check } from 'lucide-react';
import { CartItem } from '../types';
import { playBarcodeBeep, speakKorean } from '../utils/audio';

interface BarcodeScannerProps {
  cart: CartItem[];
  onAllScanned: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  cart,
  onAllScanned,
}) => {
  const [scannedIndices, setScannedIndices] = React.useState<number[]>([]);
  const [activeScanningIndex, setActiveScanningIndex] = React.useState<number | null>(null);

  const scannedCount = scannedIndices.length;

  const handleScanItem = (idx: number, item: CartItem) => {
    if (scannedIndices.includes(idx)) return;

    setActiveScanningIndex(idx);
    playBarcodeBeep();
    speakKorean(`${item.product.name}, ${item.product.price.toLocaleString()}원 찍혔습니다.`);

    setTimeout(() => {
      setScannedIndices((prev) => {
        const next = [...prev, idx];
        if (next.length === cart.length) {
          setTimeout(() => {
            speakKorean('모든 물건의 바코드를 다 찍었습니다! 점원님과 대화해 볼까요?');
            onAllScanned();
          }, 600);
        }
        return next;
      });
      setActiveScanningIndex(null);
    }, 350);
  };

  const handleScanAll = () => {
    playBarcodeBeep();
    const all = cart.map((_, i) => i);
    setScannedIndices(all);
    speakKorean('모든 상품을 한 번에 바코드 스캔했습니다.');
    setTimeout(() => {
      onAllScanned();
    }, 500);
  };

  return (
    <div className="bg-white rounded-3xl border-3 border-amber-400 p-6 shadow-xl max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-200">
        <div>
          <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-lg">
            계산대 바코드 스캔
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            물건의 바코드를 찍어보세요
          </h3>
        </div>
        <div className="text-right bg-amber-50 px-4 py-2 rounded-xl border border-amber-300">
          <span className="text-xs font-bold text-slate-500">스캔 진행</span>
          <p className="text-xl font-black text-amber-600">
            {scannedCount} / {cart.length} 개
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-700 font-medium">
        각 상품 오른쪽에 있는 큰{' '}
        <strong className="text-amber-700 font-black">[바코드 삑! 찍기]</strong> 버튼을
        눌러주세요.
      </p>

      {/* Cart Items List with Product Photos */}
      <div className="space-y-3">
        {cart.map((cartItem, idx) => {
          const isScanned = scannedIndices.includes(idx);
          const isScanning = activeScanningIndex === idx;

          return (
            <div
              key={cartItem.product.id}
              className={`p-4 rounded-2xl border-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                isScanned
                  ? 'bg-emerald-50 border-emerald-400'
                  : 'bg-white border-amber-300 hover:border-amber-500'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Product Photo */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-300 shrink-0 flex items-center justify-center">
                  {cartItem.product.imageSrc ? (
                    <img
                      src={cartItem.product.imageSrc}
                      alt={cartItem.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">{cartItem.product.imageEmoji}</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-slate-900">
                      {cartItem.product.name}
                    </span>
                    <span className="text-xs font-black bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-md text-slate-700">
                      {cartItem.quantity}개
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="font-mono text-slate-500">
                      바코드: {cartItem.product.barcode}
                    </span>
                    <span className="font-black text-amber-700 text-sm">
                      {cartItem.product.price.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              {/* Large Simple Scan Button */}
              <div className="shrink-0">
                {isScanned ? (
                  <div className="h-14 px-6 bg-emerald-600 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 border-2 border-emerald-700 shadow-sm">
                    <Check className="w-6 h-6" />
                    <span>스캔 완료!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleScanItem(idx, cartItem)}
                    disabled={isScanning}
                    className="w-full sm:w-auto h-14 px-6 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-md cursor-pointer border-2 border-amber-600 transition-colors"
                  >
                    <ScanLine className="w-6 h-6" />
                    <span>{isScanning ? '스캔 중...' : '바코드 삑! 찍기'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Controls */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={handleScanAll}
          className="text-xs text-amber-800 hover:text-amber-950 font-black underline cursor-pointer p-2"
        >
          ⚡ 한 번에 모두 스캔하기 (도움)
        </button>

        {scannedCount === cart.length && (
          <button
            onClick={onAllScanned}
            className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-base shadow-lg cursor-pointer border-2 border-emerald-700 flex items-center gap-2"
          >
            <span>다음 단계로 이동 ➔</span>
          </button>
        )}
      </div>
    </div>
  );
};
