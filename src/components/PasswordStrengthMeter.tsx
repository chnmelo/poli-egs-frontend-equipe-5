import React from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthMeterProps {
  password_value: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password_value }) => {
  const testResult = zxcvbn(password_value);
  const score = testResult.score * 100 / 4;

  const funcProgressColor = () => {
    switch (testResult.score) {
      case 0:
        return '#828282';
      case 1:
        return '#EA1111';
      case 2:
        return '#FFAD00';
      case 3:
        return '#9bc158';
      case 4:
        return '#00b500';
      default:
        return 'none';
    }
  };

  const createPassLabel = () => {
    switch (testResult.score) {
      case 0:
        return 'Muito Fraca';
      case 1:
        return 'Fraca';
      case 2:
        return 'Razoável';
      case 3:
        return 'Boa';
      case 4:
        return 'Forte';
      default:
        return '';
    }
  };

  const changePasswordColor = () => ({
    width: `${score}%`,
    background: funcProgressColor(),
    height: '7px',
  });

  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="h-2.5 rounded-full"
          style={changePasswordColor()}
        ></div>
      </div>
      <p className="text-sm mt-1" style={{ color: funcProgressColor() }}>
        {createPassLabel()}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
