import React from "react";
import {Input as InputAntd} from 'antd';
import classNames from "classnames";

interface IColorScheme {
  colorScheme?: 'white' | 'outline';
}

interface ISize {
  size?: 'sm' | 'md' | 'lg';
}

interface IType {
  type?: 'email' | 'number' | 'password' | 'tel' | 'text';
}

interface InputProps extends IColorScheme, ISize, IType {
  id?: string;
  className?: string;
  placeholder?: string;
  shadow?: boolean;
  onChange?: (e: any) => void;
  onPressEnter?: (e: any) => void;
}

const Input: React.FC<InputProps> = ({
                                       id,
                                       className,
                                       placeholder,
                                       colorScheme = 'outline',
                                       size = 'sm',
                                       type = 'text',
                                       shadow = false,
                                       onChange,
                                       onPressEnter
                                     }) => {
  return (
    <InputAntd
      id={id}
      className={classNames(
        className || '',
        'text text-bold-semi input',
        `input-${size}`,
        `input-${colorScheme}`, {
          'box-shadow': shadow,
        }
      )}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      onPressEnter={onPressEnter}
    />
  )
}
export default Input;
