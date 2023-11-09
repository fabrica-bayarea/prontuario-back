import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
} from 'class-validator';

export type AtendimentoResponse = {
  atendimento: {
    id: number;
    data: Date;
    beneficiario: {
      id: number;
      nome: string;
      cpf: string;
      email: string;
      telefone: string;
    };
    programa: {
      id: number;
      nome: string;
    };
    usuario: {
      id: number;
      nome: string;
      email: string;
    };
  };
};

export class CreateAtendimentoDto {
  @IsDateString()
  data: Date;

  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  cpfBeneficiario: string;

  @IsString()
  @IsNotEmpty()
  nomePrograma: string;
}

export class GetAtendimentoByCpfDto {
  @Matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/, {
    message:
      'cpf deve  ter os nove primeiros dígitos agrupados em três grupos de três dígitos separados por um ponto, seguidos de um hífen e dos dois últimos dígitos',
  })
  cpfBeneficiario: string;
}

export class AtendimentoFilterDto {
  @IsDateString()
  dataInicio: Date;

  @IsDateString()
  dataFim: Date;
}

export class UpdateDataAtendimentoDto {
  @IsDateString()
  novaData: string;
}
