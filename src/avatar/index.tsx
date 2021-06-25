export default class Avatar {
  size = 10;

  add(num1: number, num2: number) {
    return num1 + num2;
  }
  mounted() {
    this.add(2, 3);
  }
}
