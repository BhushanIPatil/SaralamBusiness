import { statusClassMap, statusLabelMap } from '../../utils/formatters';

export default function StatusBadge({ status }) {
  return (
    <span className={`bdg ${statusClassMap[status] || 'b-completed'}`}>
      {statusLabelMap[status] || status}
    </span>
  );
}
