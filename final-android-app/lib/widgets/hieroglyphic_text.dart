import 'package:flutter/material.dart';

class HieroglyphicText extends StatelessWidget {
  final double fontSize;
  final Color? color;
  final bool isTop;
  final EdgeInsetsGeometry? padding;

  const HieroglyphicText({
    Key? key,
    this.fontSize = 12.0,
    this.color,
    this.isTop = true,
    this.padding,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: padding ?? EdgeInsets.symmetric(
        vertical: isTop ? 8.0 : 12.0,
        horizontal: 16.0,
      ),
      child: Text(
        '𓎢𓃭𓅂𓅱𓄿𓂋𓄿',
        textAlign: TextAlign.center,
        style: TextStyle(
          fontSize: fontSize,
          color: color ?? Theme.of(context).textTheme.bodySmall?.color?.withOpacity(0.6),
          fontWeight: FontWeight.w300,
          letterSpacing: 2.0,
        ),
      ),
    );
  }
}

class HieroglyphicAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final List<Widget>? actions;
  final Widget? leading;
  final bool automaticallyImplyLeading;
  final Color? backgroundColor;

  const HieroglyphicAppBar({
    Key? key,
    required this.title,
    this.actions,
    this.leading,
    this.automaticallyImplyLeading = true,
    this.backgroundColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const HieroglyphicText(
          fontSize: 10.0,
          isTop: true,
          padding: EdgeInsets.only(top: 8.0, bottom: 4.0),
        ),
        AppBar(
          title: Text(title),
          actions: actions,
          leading: leading,
          automaticallyImplyLeading: automaticallyImplyLeading,
          backgroundColor: backgroundColor,
          elevation: 0,
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight + 32.0);
}

class HieroglyphicScaffold extends StatelessWidget {
  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final Widget? leading;
  final bool automaticallyImplyLeading;
  final Widget? floatingActionButton;
  final Widget? bottomNavigationBar;
  final Widget? drawer;
  final Color? backgroundColor;
  final bool showHieroglyphicsAtBottom;

  const HieroglyphicScaffold({
    Key? key,
    required this.body,
    this.title,
    this.actions,
    this.leading,
    this.automaticallyImplyLeading = true,
    this.floatingActionButton,
    this.bottomNavigationBar,
    this.drawer,
    this.backgroundColor,
    this.showHieroglyphicsAtBottom = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: title != null
          ? HieroglyphicAppBar(
              title: title!,
              actions: actions,
              leading: leading,
              automaticallyImplyLeading: automaticallyImplyLeading,
              backgroundColor: backgroundColor,
            )
          : null,
      body: Column(
        children: [
          if (title == null)
            const HieroglyphicText(
              fontSize: 10.0,
              isTop: true,
            ),
          Expanded(child: body),
          if (showHieroglyphicsAtBottom)
            const HieroglyphicText(
              fontSize: 10.0,
              isTop: false,
            ),
        ],
      ),
      floatingActionButton: floatingActionButton,
      bottomNavigationBar: bottomNavigationBar,
      drawer: drawer,
      backgroundColor: backgroundColor,
    );
  }
}
