import React from 'react';

import { Button, Input } from '../../../atoms';

import './AdminContent.scss';

interface IItems {
  title: string;
  inputType: any;
  inputPlaceholder?: string;
  inputChange: any;
  inputValue: string;
}

interface IAdminContent {
  items: IItems[];
  btnText: string;
  btnClick: any;
  btnProcessed?: boolean;
  btnProcessedText?: string;
}

const AdminContent: React.FC<IAdminContent> = ({
  items,
  btnText,
  btnClick,
  btnProcessed = false,
  btnProcessedText = 'Please Wait...',
}) => {
  return (
    <div className="admin-content">
      <div className="admin-content-wrap">
        {items.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className="admin-content-item" key={index}>
            <span className="admin-content-item-title">{item.title}</span>
            <Input
              size="md"
              placeholder={item.inputPlaceholder || '0.0'}
              colorScheme="outline"
              type={item.inputType}
              onChange={(e) => item.inputChange(e.target.value)}
              value={item.inputValue}
              shadow
            />
          </div>
        ))}

        {btnProcessed ? (
          <Button disabled size="lmd">
            <span className="text-upper text-slg">{btnProcessedText}</span>
          </Button>
        ) : (
          <Button size="lmd" onClick={() => btnClick()}>
            <span className="text-upper text-slg">{btnText}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminContent;
