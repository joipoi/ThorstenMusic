package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

@SpringBootApplication
public class Main {

	public static void main(String[] args) {

		JFrame jFrame = new JFrame();
		jFrame.setTitle("Server Status");
		jFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		jFrame.setSize(500, 400);

		// Create a panel with default FlowLayout
		JPanel panel = new JPanel();

		// Add label
		JLabel label = new JLabel("Server is running");
		label.setFont(label.getFont().deriveFont(18f));
		panel.add(label);

		// Add button
		JButton button = new JButton("STOP SERVER");
		Dimension buttonSize = button.getPreferredSize();
		buttonSize.width = 200; // Adjust the width of the button
		buttonSize.height = 100;
		button.setPreferredSize(buttonSize);
		button.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				System.exit(0);
			}
		});
		panel.add(button);

		jFrame.getContentPane().add(panel);
		jFrame.setVisible(true);

		SpringApplication.run(Main.class, args);
	}

}
