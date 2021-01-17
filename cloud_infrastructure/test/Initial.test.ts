import { Initial } from '../bin/Initial';



describe('Initial test suite', ()=>{


    test('test add', ()=>{
        const initial = new Initial();
        expect(initial.add(1,2)).toBe(3);
    })
});