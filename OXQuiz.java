import java.util.Scanner;

public class OXQuiz {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("문제 수 : ");
        int n = sc.nextInt();
        int[] answer = new int[n];
        int[] student = new int[n];
        System.out.print("정답 입력 : ");
        for (int i = 0; i < n; i++) {
            answer[i] = sc.nextInt();
        }
        System.out.print("답안 입력 : ");
        for (int i = 0; i < n; i++) {
            student[i] = sc.nextInt();
        }
        int base = 0;
        int bonus = 0;
        int streak = 0;
        for (int i = 0; i < n; i++) {
            if (answer[i] == student[i]) {
                System.out.println((i + 1) + "번 : O");
                base++;
                streak++;
                if (streak >= 2) {
                    bonus++;
                }
            } else {
                System.out.println((i + 1) + "번 : X");
                streak = 0;
            }
        }
        System.out.println("기본 점수 : " + base + "점");
        System.out.println("가산점     : " + bonus + "점");
        System.out.println("최종 점수 : " + (base + bonus) + "점");
        sc.close();
    }
}
