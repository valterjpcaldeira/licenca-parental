'use client';

import { useState } from 'react';

const GOVPT_URL = 'https://www.gov.pt/guias/ter-uma-crianca/licenca-parental';

export default function RulesSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <h2 className="text-lg font-semibold text-slate-800">
          📋 Como funciona a licença parental?
        </h2>
        <span className="text-2xl text-slate-400">{isExpanded ? '−' : '+'}</span>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 p-4 text-slate-600">
          <div className="space-y-4 text-sm">
            <p>
              A licença parental inicial pode ser de <strong>120 ou 150 dias seguidos</strong> (incluindo fins de semana e feriados). Os pais escolhem a opção; a diferença está no valor do subsídio.
            </p>

            <div>
              <h3 className="mb-2 font-semibold text-slate-800">Períodos obrigatórios (120 e 150 dias)</h3>
              <ul className="list-inside list-disc space-y-1">
                <li>
                  <strong>Mãe: 42 dias</strong> imediatamente após o parto
                </li>
                <li>
                  <strong>Pai: 28 dias</strong> (7 imediatos + 21 durante os 42 da mãe). Opcionalmente +7 dias (total 35), a gozar durante os 42 da mãe.
                </li>
              </ul>
              <p className="mt-2">
                Os 42 dias da mãe e os 28+7 do pai decorrem nos primeiros 42 dias após o parto e não se somam ao total de 120 ou 150 dias.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-slate-800">Restantes dias (até 120 ou 150)</h3>
              <p>
                Após os 42 dias obrigatórios da mãe, os restantes dias até 120 ou 150 podem ser gozados por um dos pais ou repartidos entre ambos, como quiserem.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-slate-800">30 dias extra (licença partilhada)</h3>
              <p>
                Os pais podem ter mais <strong>30 dias</strong> se partilharem a licença: cada um tem de gozar, em exclusivo, pelo menos <strong>30 dias seguidos ou dois períodos de 15 dias seguidos</strong>. Assim, 120+30=150 dias totais ou 150+30=180 dias totais.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-slate-800">Subsídio (remuneração de referência)</h3>
              <ul className="list-inside list-disc space-y-1">
                <li><strong>120 dias:</strong> 100%</li>
                <li><strong>150 dias</strong> (sem partilha): 80%</li>
                <li><strong>150 dias (120+30)</strong> com partilha: 100%</li>
                <li><strong>180 dias (150+30)</strong> com partilha: 83% (ou 90% se o pai gozar 60 dias seguidos ou dois períodos de 30 dias)</li>
              </ul>
              <p className="mt-2">
                No período obrigatório do pai (28+7 dias) o subsídio do pai é sempre pago a 100%.
              </p>
            </div>

            <a
              href={GOVPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:underline"
            >
              Fonte: Guia oficial em gov.pt — Licença e subsídio parental →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
