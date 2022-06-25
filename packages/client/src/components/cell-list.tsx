import './cell-list.css';
import React, { FC, Fragment } from 'react';
import { useTypedSelector } from '../hooks/use-types-selector';
import AddCell from './add-cell';
import CellListItem from './cell-list-item';

const CellList: FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {cells.map((cell) => (
        <Fragment key={cell.id}>
          <CellListItem key={cell.id} cell={cell} />
          <AddCell previousCellId={cell.id} />
        </Fragment>
      ))}
    </div>
  );
};

export default CellList;
