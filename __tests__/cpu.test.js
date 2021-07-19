import CPU from '../src/lib/cpu'
import CPU_REGISTERS from '../src/lib/cpu-registers'
import CPU_FLAGS from '../src/lib/cpu-flags'
import CPU_ADDRESSING_MODES from '../src/lib/cpu-addressing-modes'
import CPU_MEMORY_MAP from '../src/lib/cpu-mempry-map'

describe('Tests for CPU module.', () => {
  let cpu

  beforeEach(() => {
    cpu = CPU()
  })
  test('should load CPU module.', () => {
    expect(cpu).toBeDefined()
  })

  test('should have a memory map.', () => {
    const memory = cpu.MEM

    expect(memory).toBeDefined()
    expect(memory.length).toBe(0xffff)
  })

  test('should set the PC register.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.PC, value)

    expect(cpu.REG.PC).toBe(value)
  })

  test('should set the PC register keeping the 16-bit size.', () => {
    const value = 0xabcdef
    cpu.setRegister(CPU_REGISTERS.PC, value)

    expect(cpu.REG.PC).toBe(0xcdef)
  })

  test('should set the SP register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.SP, value)

    expect(cpu.REG.SP).toBe(value)
  })

  test('should set the SP register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.SP, value)

    expect(cpu.REG.SP).toBe(0xcd)
  })

  test('should set the A register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.A, value)

    expect(cpu.REG.A).toBe(value)
  })

  test('should set the A register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.A, value)

    expect(cpu.REG.A).toBe(0xcd)
  })

  test('should set the X register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.X, value)

    expect(cpu.REG.X).toBe(value)
  })

  test('should set the X register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.X, value)

    expect(cpu.REG.X).toBe(0xcd)
  })

  test('should set the Y register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.Y, value)

    expect(cpu.REG.Y).toBe(value)
  })

  test('should set the Y register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.Y, value)

    expect(cpu.REG.Y).toBe(0xcd)
  })

  test('should set the P register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.REG.P).toBe(value)
  })

  test('should set the P register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.REG.P).toBe(0xcd)
  })

  test('should set the P register and all status flags are setted to 1.', () => {
    const value = 0xff
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.REG.P).toBe(0xff)

    expect(cpu.getFlag(CPU_FLAGS.CarryFlag)).toBe(1)
    expect(cpu.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpu.getFlag(CPU_FLAGS.InterruptDisable)).toBe(1)
    expect(cpu.getFlag(CPU_FLAGS.BreakCommand)).toBe(1)
    expect(cpu.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
    expect(cpu.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('should set the P register and all status flags are setted to 0.', () => {
    const value = 0x00
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.REG.P).toBe(0x00)

    expect(cpu.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpu.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpu.getFlag(CPU_FLAGS.InterruptDisable)).toBe(0)
    expect(cpu.getFlag(CPU_FLAGS.BreakCommand)).toBe(0)
    expect(cpu.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
    expect(cpu.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('should set the P register with 1 and 0 values in the status flags.', () => {
    const value = 0b10101010
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.REG.P).toBe(0b10101010)

    expect(cpu.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpu.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpu.getFlag(CPU_FLAGS.InterruptDisable)).toBe(0)
    expect(cpu.getFlag(CPU_FLAGS.BreakCommand)).toBe(0)
    expect(cpu.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
    expect(cpu.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('should get data from Acumulator addressing mode.', () => {
    const acumulatorValue = 0xab
    cpu.setRegister(CPU_REGISTERS.A, acumulatorValue)

    const value = cpu.getValue(CPU_ADDRESSING_MODES.Acumulator)

    expect(value).toBe(acumulatorValue)
  })

  test('should get data from Immediate addressing mode.', () => {
    const immediateValue = 0xab
    const value = cpu.getValue(CPU_ADDRESSING_MODES.Immediate, immediateValue)

    expect(value).toBe(immediateValue)
  })

  test('should get data from Zero Page addressing mode.', () => {
    const memoryValue = 0x78
    const zeroPageOffset = 0x10
    const memoryAddress = CPU_MEMORY_MAP.ZeroPage + zeroPageOffset
    cpu.putMemoryValue(memoryAddress, memoryValue)

    const value = cpu.getValue(CPU_ADDRESSING_MODES.ZeroPage, zeroPageOffset)

    expect(value).toBe(memoryValue)
  })

  test('should get data from Zero Page, X addressing mode.', () => {
    const memoryValue = 0xbe
    const registerXValue = 0xff
    const zeroPageOffset = 0x80
    const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((zeroPageOffset + registerXValue) & 0xff)

    cpu.setRegister(CPU_REGISTERS.X, registerXValue)
    cpu.putMemoryValue(memoryAddress, memoryValue)

    const value = cpu.getValue(CPU_ADDRESSING_MODES.ZeroPageX, zeroPageOffset)

    expect(value).toBe(memoryValue)
  })

  test('should get data from Zero Page, Y addressing mode.', () => {
    const memoryValue = 0xd7
    const registerYValue = 0xff
    const zeroPageOffset = 0x86
    const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((zeroPageOffset + registerYValue) & 0xff)

    cpu.setRegister(CPU_REGISTERS.Y, registerYValue)
    cpu.putMemoryValue(memoryAddress, memoryValue)

    const value = cpu.getValue(CPU_ADDRESSING_MODES.ZeroPageY, zeroPageOffset)

    expect(value).toBe(memoryValue)
  })

  test('should get data from Relative addressing mode with negative operand.', () => {
    const signedValue = 0xff

    const value = cpu.getValue(CPU_ADDRESSING_MODES.Relative, signedValue)
    expect(value).toBe(-1)
  })

  test('should get data from Relative addressing mode with positive operand.', () => {
    const signedValue = 0x7f

    const value = cpu.getValue(CPU_ADDRESSING_MODES.Relative, signedValue)
    expect(value).toBe(127)
  })

  test('should get data from Absolute addressing mode.', () => {
    const absoluteaValue = 0xabcd

    const value = cpu.getValue(CPU_ADDRESSING_MODES.Absolute, absoluteaValue)
    expect(value).toBe(0xabcd)
  })
})
