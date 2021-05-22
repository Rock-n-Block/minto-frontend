import React from 'react';
import { Link } from 'react-router-dom';
import { Button as BtnAntd } from 'antd';
import classNames from 'classnames';

export interface IColorScheme {
  colorScheme?: 'green' | 'outline';
}

export interface ISize {
  size?: 'sm' | 'smd' | 'md' | 'lmd' | 'lg';
}

export interface ButtonProps extends IColorScheme, ISize {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  link?: string;
  linkClassName?: string;
  shadow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  size = 'md',
  colorScheme = 'green',
  onClick,
  disabled = false,
  loading = false,
  link,
  linkClassName,
}) => {
  const Btn = (
    <BtnAntd
      onClick={onClick}
      disabled={disabled || loading}
      className={classNames(
        className || '',
        'text text-bold btn',
        `btn-${size}`,
        `btn-${colorScheme}`,
        {
          'btn-loading': loading,
        },
      )}
    >
      {loading ? 'In progress...' : children}
    </BtnAntd>
  );
  if (link) {
    return (
      <Link className={classNames('btn-link', linkClassName)} to={link}>
        {Btn}
      </Link>
    );
  }
  return Btn;
};

export default Button;
