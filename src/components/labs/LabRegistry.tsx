import type { LabId, ToastVariant } from '../../types/course';
import {
  EventLoopLab,
  HttpExplorerLab,
  ReactLifecycleLab,
  ThemeTokenLab,
  TsPlaygroundLab,
  UrlDissectorLab,
} from './CoreLabs';
import {
  ArchTracerLab,
  CronSqlLab,
  DebugDetectiveLab,
  FasCheckLab,
  PinboardSimLab,
  ProxySecurityLab,
  SdkLimitsLab,
  SecurityTokenLab,
} from './AdvancedLabs';

interface LabSlotProps {
  id: LabId;
  onToast: (msg: string, variant?: ToastVariant) => void;
  onToggleTheme: () => void;
}

export function LabSlot({ id, onToast, onToggleTheme }: LabSlotProps) {
  switch (id) {
    case 'url-dissector':
      return <UrlDissectorLab />;
    case 'http-explorer':
      return <HttpExplorerLab />;
    case 'theme-token-lab':
      return <ThemeTokenLab onToast={onToast} onToggleTheme={onToggleTheme} />;
    case 'event-loop-lab':
      return <EventLoopLab />;
    case 'ts-playground':
      return <TsPlaygroundLab />;
    case 'react-lifecycle-lab':
      return <ReactLifecycleLab />;
    case 'cron-sql-lab':
      return <CronSqlLab />;
    case 'security-token-lab':
      return <SecurityTokenLab />;
    case 'sdk-limits-lab':
      return <SdkLimitsLab />;
    case 'fas-check-lab':
      return <FasCheckLab />;
    case 'proxy-security-lab':
      return <ProxySecurityLab />;
    case 'arch-tracer-lab':
      return <ArchTracerLab />;
    case 'pinboard-sim':
      return <PinboardSimLab onToast={onToast} />;
    case 'debug-detective-lab':
      return <DebugDetectiveLab />;
    default:
      return null;
  }
}
