import React from 'react';
import nextId from 'react-id-generator';

import { Input } from '../../atoms';

import './Calculator.scss';

interface IInfo {
  title: string;
  value: string;
  text: string;
}

interface ICalculator {
  title: string;
  input: {
    title: string;
    placeholder: string;
    value: string;
    change: any;
    type: 'number' | 'text' | 'email' | 'password' | 'tel' | undefined;
  };
  info: IInfo[];
}

const Calculator: React.FC<ICalculator> = ({ title, info, input }) => {
  return (
    <div className="calculator">
      <span className="calculator-title">{title}</span>
      <span className="calculator-title-input">{input.title}</span>

      <Input
        size="lg"
        placeholder={input.placeholder}
        colorScheme="outline"
        type={input.type}
        shadow
        onChange={(e) => input.change(e.target.value)}
        value={input.value}
      />

      <div className="calculator-info">
        {info.map((item) => (
          <div className="calculator-info-item" key={nextId()}>
            <span className="calculator-info-item-title">{item.title}</span>
            <div className="calculator-info-item-block">
              <span className="calculator-info-item-value">{item.value}</span>
              <span className="calculator-info-item-text">{item.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
