/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Printer, Award, Sparkles, Check } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stampsCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  stampsCount,
}) => {
  const [studentName, setStudentName] = React.useState('김행복');
  const [schoolName, setSchoolName] = React.useState('우리꿈 특수학급');

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border-4 border-amber-300 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto print:fixed print:inset-0 print:border-none print:shadow-none print:m-0 print:p-8">
        {/* Close Button (Hidden when printing) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Input Form for Name (Hidden when printing) */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 mb-6 print:hidden">
          <span className="text-xs font-bold text-amber-900 block mb-2">
            ✏️ 인증서에 들어갈 학생 이름을 적어주세요:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                학생 이름
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="예: 김민수"
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                학교 / 학급명
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="예: 행복중학교 특수학급"
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-amber-500"
              />
            </div>
          </div>
        </div>

        {/* The Printable Certificate Box */}
        <div className="border-8 border-double border-amber-400 bg-linear-to-b from-amber-50/40 via-white to-amber-50/30 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-2xl text-amber-400 opacity-60">⚜️</div>
          <div className="absolute top-2 right-2 text-2xl text-amber-400 opacity-60">⚜️</div>
          <div className="absolute bottom-2 left-2 text-2xl text-amber-400 opacity-60">⚜️</div>
          <div className="absolute bottom-2 right-2 text-2xl text-amber-400 opacity-60">⚜️</div>

          {/* Certificate Header */}
          <div className="inline-block px-4 py-1 bg-amber-500 text-white rounded-full text-xs font-black tracking-widest uppercase mb-2">
            CERTIFICATE OF ACHIEVEMENT
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            편의점 쇼핑 달인 인증서
          </h2>
          <p className="text-xs text-amber-800 font-bold mt-1">
            (특수학급 중학생 일상 자립 생활 경제 교육 과정)
          </p>

          {/* Golden Badge Visual */}
          <div className="my-5 flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-400 shadow-md overflow-hidden bg-white">
              <img
                src="/src/assets/images/shopping_badge_trophy_1794016354793.jpg"
                alt="쇼핑 달인 메달"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Student Recipient Name */}
          <div className="my-4">
            <span className="text-xs text-slate-500 block mb-1">수여 대상</span>
            <div className="inline-block border-b-2 border-slate-900 pb-1 px-8">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {studentName || '학생'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-bold">{schoolName}</p>
          </div>

          {/* Commendation Body Text */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-lg mx-auto font-medium my-6 px-2">
            위 학생은 우리동네 편의점 경제 교실에서 가격표를 정확히 읽고,
            구매 목록에 맞춰 스스로 물건을 선택하며, 점원과 예의 바르게 소통하고
            화폐를 바르게 지불하여 <strong>독립적인 편의점 쇼핑 역량</strong>을
            훌륭히 증명하였으므로 이 인증서를 수여합니다.
          </p>

          {/* Date & Seal */}
          <div className="mt-8 pt-4 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              <span className="block font-bold">수여일자</span>
              <span>{todayStr}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-red-500 text-red-600 flex items-center justify-center font-black text-[11px] transform rotate-[-8deg]">
                참잘했어요<br />달인인증
              </div>
              <div className="text-left">
                <span className="font-bold text-slate-800 block text-xs">
                  도전! 편의점 쇼핑왕 교육원
                </span>
                <span className="text-[10px] text-slate-500">담당 지도교사 확인</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions (Hidden when printing) */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
          >
            닫기
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>인증서 인쇄 / PDF 저장하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
