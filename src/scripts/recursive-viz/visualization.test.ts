import {describe, expect, test, vi} from 'vitest';
import type {RawRecord} from './node-factory';
import {Visualization} from './visualization';

describe('Visualization', function () {

    const data: RawRecord[] = [
        ["enter",0,null,[5]], ["enter",1,0,[4]], ["enter",2,1,[3]], ["enter",3,2,[2]], ["enter",4,3,[1]], ["exit",4,3,1],
        ["enter",5,3,[0]],["exit",5,3,0],["exit",3,2,1],["enter",6,2,[1]],["exit",6,2,1],["exit",2,1,2],["enter",7,1,[2]],
        ["enter",8,7,[1]],["exit",8,7,1],["enter",9,7,[0]],["exit",9,7,0],["exit",7,1,1],["exit",1,0,3],["enter",10,0,[3]],
        ["enter",11,10,[2]],["enter",12,11,[1]],["exit",12,11,1],["enter",13,11,[0]],["exit",13,11,0],["exit",11,10,1],
        ["enter",14,10,[1]],["exit",14,10,1],["exit",10,0,2],["exit",0,null,5]];

    test('maxSteps', () => {
        const mockCanvas = {
            fillStyle: '',
            fillRect: vi.fn(() => 0),
        } as any as CanvasRenderingContext2D;
        const visualization = new Visualization(mockCanvas, 500, 500);
        expect(visualization.maxSteps()).toEqual(0);
        visualization.setSource(data);
        expect(visualization.maxSteps()).toEqual(14);
        visualization.setSource([["enter",0,null,[5]], ["enter",1,0,[4]], ["enter",2,1,[3]], ["enter",3,2,[2]], ["enter",4,3,[1]], ["exit",4,3,1]]);
        expect(visualization.maxSteps()).toEqual(4);
        visualization.setSource([["enter",0,null,[5]]]);
        expect(visualization.maxSteps()).toEqual(0);
    });

    test('prevStep', () => {
        const mockCanvas = {
            fillStyle: '',
            fillRect: vi.fn(() => 0),
        } as any as CanvasRenderingContext2D;
        const visualization = new Visualization(mockCanvas, 500, 500);
        visualization.setSource([["enter",0,null,[5]], ["enter",1,0,[4]], ["enter",2,1,[3]], ["enter",3,2,[2]]]);
        expect(visualization.getCurrentStep()).toEqual(3);
        visualization.prevStep();
        expect(visualization.getCurrentStep()).toEqual(2);
        visualization.prevStep();
        expect(visualization.getCurrentStep()).toEqual(1);
        visualization.prevStep();
        expect(visualization.getCurrentStep()).toEqual(0);
        visualization.prevStep();
        expect(visualization.getCurrentStep()).toEqual(3);
    });

    test('nextStep', () => {
        const mockCanvas = {
            fillStyle: '',
            fillRect: vi.fn(() => 0),
        } as any as CanvasRenderingContext2D;
        const visualization = new Visualization(mockCanvas, 500, 500);
        visualization.setSource([["enter",0,null,[5]], ["enter",1,0,[4]], ["enter",2,1,[3]], ["enter",3,2,[2]]]);
        expect(visualization.getCurrentStep()).toEqual(3);
        visualization.nextStep();
        expect(visualization.getCurrentStep()).toEqual(0);
        visualization.nextStep();
        expect(visualization.getCurrentStep()).toEqual(1);
        visualization.nextStep();
        expect(visualization.getCurrentStep()).toEqual(2);
        visualization.nextStep();
        expect(visualization.getCurrentStep()).toEqual(3);
    });

    test('decreaseFontSize', () => {
        const visualization = new Visualization({} as any, 500, 500);
        expect(visualization.getFontSize()).toEqual(18);
        visualization.decreaseFontSize();
        expect(visualization.getFontSize()).toEqual(16);
        visualization.decreaseFontSize();
        expect(visualization.getFontSize()).toEqual(14);
        for (let i=0; i<50; i++) {
            visualization.decreaseFontSize();
        }
        expect(visualization.getFontSize()).toEqual(6);
    });

    test('increaseFontSize', () => {
        const visualization = new Visualization({} as any, 500, 500);
        expect(visualization.getFontSize()).toEqual(18);
        visualization.increaseFontSize();
        expect(visualization.getFontSize()).toEqual(20);
        visualization.increaseFontSize();
        expect(visualization.getFontSize()).toEqual(22);
        for (let i=0; i<50; i++) {
            visualization.increaseFontSize();
        }
        expect(visualization.getFontSize()).toEqual(40);
    });

});
