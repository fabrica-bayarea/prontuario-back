import { Test, TestingModule } from '@nestjs/testing';
import { CursoController } from './curso.controller';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './curso.dto';
import { AuthService } from '../auth/auth.service';
import { request } from 'http';


describe("CursoController", () => {

    let cursoController: CursoController;

    const mockCursoService = {
        createCurso: jest.fn(),
        getAllCursos: jest.fn(),
        getCursoById: jest.fn(),
        filterCursosByName: jest.fn(),
        updateCurso: jest.fn,
        deleteCurso: jest.fn()
    }

    const mockAuthService = {
        signToken: jest.fn(),
        isAdministrator: jest.fn()
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CursoController],
            providers: [{ provide: CursoService, useValue: mockCursoService }],
        }).compile();

        cursoController = module.get<CursoController>(CursoController);
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("Should be defined", () => {
        expect(cursoController).toBeDefined();
    });
jest.mock('@nestjs/common');
const auth = require('@nestjs/common');
    it( "createCurso", async () => {
        const id = auth.mockimplamentation();
        const cursoDto: CreateCursoDto = {
            nome: "ADS"
        }

        await cursoController.createCurso(id, cursoDto);

        expect(mockCursoService.createCurso).toHaveBeenCalledTimes(1);
        expect(mockCursoService.createCurso).toHaveBeenCalledWith({
            where: { nome: cursoDto.nome },
        });
    });
    
    it("getAllCursos", async () => {
        await cursoController.getAllCursos();

        expect(mockCursoService.getAllCursos).toHaveBeenCalledTimes(1);
        expect(mockCursoService.getAllCursos).toHaveBeenCalledWith();
    });

    it("getCursoById", async () => {
        const idCurso = 1;
        await cursoController.getCursoById(idCurso);

        expect(mockCursoService.getCursoById).toHaveBeenCalledTimes(1);
        expect(mockCursoService.getCursoById).toHaveBeenCalledWith(idCurso);
    });

/*    it("updateCurso", async () => {
        const idUsuario = 1;
        const idCurso = 1;
        const cursoDto: UpdateCursoDto = {
            nome: "ADS"
        }

        await cursoController.updateCurso(idUsuario, idCurso, cursoDto);

        expect(mockCursoService.updateCurso).toHaveBeenCalledTimes(1);
        expect(mockCursoService.updateCurso).toHaveBeenCalledWith(idCurso, idUsuario);
    });
*/
/*    it("deleteCurso", async () => {
        const idUsuario = 1;
        const idCurso = 1;
        await cursoController.deleteCurso(idUsuario, idCurso);

        expect(mockCursoService.deleteCurso).toHaveBeenCalledTimes(1);
        expect(mockCursoService.deleteCurso).toHaveBeenCalledWith(idCurso);
    }); */
});