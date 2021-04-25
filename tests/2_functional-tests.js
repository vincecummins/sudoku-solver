const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings')

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('post requests to /api/solve', () => {
        test('valid puzzle string', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: puzzlesAndSolutions[0][0]
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, puzzlesAndSolutions[0][1])
                    done();
                })
        })
        test('missing puzzle string', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field missing')
                    done();
                })
        })
        test('invalid puzzle characters', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: puzzlesAndSolutions[0][0].replace(9, 'e')
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle')
                    done();
                })
        })
        test('incorrect puzzle length', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: '123'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                    done();
                })
        })
        test('puzzle that cannot be solved', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Puzzle cannot be solved')
                    done();
                })
        })
    })
    suite('post requests to /api/check', () => {
        test('check puzzle placement with all fields', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'A1',
                    value: '7'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isTrue(res.body.valid);
                    done();
                })
        })
        test('check puzzle with single placement conflict', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'A5',
                    value: '8'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid)
                    assert.deepEqual(res.body.conflict, ['row'])
                    done();
                })
        })
        test('check puzzle with multiple placement conflicts', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'A1',
                    value: '5'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid)
                    assert.deepEqual(res.body.conflict, ['row', 'region'])
                    done();
                })
        })
        test('check puzzle with all placement conflicts', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'B2',
                    value: '2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid)
                    assert.deepEqual(res.body.conflict, ['row', 'column', 'region'])
                    done();
                })
        })
        test('check puzzle with missing required fields', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'B2',
                    value: ''
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field(s) missing')
                    done();
                })
        })
        test('check puzzle placement with invalid invalid puzzle characters', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0].replace(1, 'p'),
                    coordinate: 'B2',
                    value: '1'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle')
                    done();
                })
        })
        test('check puzzle with incorrect length', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '123...',
                    coordinate: 'B2',
                    value: '1'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                    done();
                })
        })
        test('check puzzle with invalid placement coordinate', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'B2e',
                    value: '1'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid coordinate')
                    done();
                })
        })
        test('check puzzle with invalid placement value', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'B2',
                    value: 'ee'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid value')
                    done();
                })
        })
    })
});

