import processPrs from './process-prs'
import {arrayToGenerator} from './common-test';

test('Gets PRs', async () =>{
    const actions = {
        getPrs: jest.fn(() => (arrayToGenerator([])))
    }
    await processPrs(actions);
    expect(actions.getPrs.mock.calls.length).toEqual(1);
});

test('Gets PRs and does nothing else if labels arent set', async () =>{
    const actions = {
        getPrs: jest.fn(() => (arrayToGenerator([]))),
        closePrs:jest.fn(),        
        markPrs:jest.fn(),
        mergePrs:jest.fn(),
        unmarkPrs:jest.fn()
    }
    await processPrs(actions);
    expect(actions.getPrs.mock.calls.length).toEqual(1);
    expect(actions.closePrs.mock.calls.length).toEqual(0);
    expect(actions.markPrs.mock.calls.length).toEqual(0);
    expect(actions.mergePrs.mock.calls.length).toEqual(0);
    expect(actions.unmarkPrs.mock.calls.length).toEqual(0);
});